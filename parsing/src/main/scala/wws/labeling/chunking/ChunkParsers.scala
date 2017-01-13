package wws.labeling.chunking

import wws.tokenization.Lexer.Token

import scala.util.parsing.combinator.Parsers

/**
  * Created by weil1 on 1/12/17.
  */
object ChunkParsers extends Parsers {
  override type Elem = Token

}
